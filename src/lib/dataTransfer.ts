import type { Quest, QuestCompletion } from '@/hooks/useQuestStore';

export interface QuestDataSnapshot {
  quests: Quest[];
  todayQuestId: string | null;
  completions: QuestCompletion[];
}

const INVALID_EXPORT_MESSAGE = 'This file is not a valid Microquest backup.';
const INVALID_JSON_MESSAGE = 'This file is not valid JSON.';
const INVALID_CSV_MESSAGE = 'This file is not a valid Microquest CSV backup.';
const INVALID_CSV_ROW_MESSAGE = 'This CSV backup contains an invalid row.';
const INVALID_CSV_TODAY_CONFLICT_MESSAGE =
  'This CSV backup contains conflicting today quest rows.';
const CSV_COLUMNS = [
  'entry_type',
  'title',
  'description',
  'created_at',
  'completed_at',
  'reflection',
  'is_today',
  'is_favorite',
] as const;

type CsvEntryType = 'quest' | 'completed_quest';

interface CsvRow {
  entryType: CsvEntryType;
  title: string;
  description: string;
  createdAt: string;
  completedAt: string;
  reflection: string;
  isToday: boolean;
  isFavorite: boolean;
}

interface CsvQuestRecord {
  quest: Quest;
  hasQuestRow: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const hasString = (value: unknown): value is string => typeof value === 'string';

export function createQuestDataSnapshot(snapshot: QuestDataSnapshot): QuestDataSnapshot {
  return {
    quests: snapshot.quests.map((quest) => ({ ...quest })),
    todayQuestId: snapshot.todayQuestId,
    completions: snapshot.completions.map((completion) => ({ ...completion })),
  };
}

export function stringifyQuestDataExport(snapshot: QuestDataSnapshot): string {
  return JSON.stringify(createQuestDataSnapshot(snapshot), null, 2);
}

const escapeCsvValue = (value: string): string => {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
};

const normalizeQuestIdentity = (title: string, description: string): string =>
  `${title.trim().toLowerCase()}::${description.trim().toLowerCase()}`;

const parseBooleanCell = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  throw new Error(INVALID_CSV_ROW_MESSAGE);
};

const parseCsvRows = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushRow = () => {
    row.push(field);

    // Ignore fully empty rows so trailing newlines do not become hard failures.
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }

    row = [];
    field = '';
  };

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];

    if (inQuotes) {
      if (char === '"') {
        if (csvText[index + 1] === '"') {
          field += '"';
          index += 1;
          continue;
        }

        inQuotes = false;
        continue;
      }

      field += char;
      continue;
    }

    if (char === '"') {
      if (field.length > 0) {
        throw new Error(INVALID_CSV_MESSAGE);
      }

      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(field);
      field = '';
      continue;
    }

    if (char === '\n') {
      pushRow();
      continue;
    }

    if (char === '\r') {
      if (csvText[index + 1] === '\n') {
        index += 1;
      }

      pushRow();
      continue;
    }

    field += char;
  }

  if (inQuotes) {
    throw new Error(INVALID_CSV_MESSAGE);
  }

  if (field.length > 0 || row.length > 0) {
    pushRow();
  }

  return rows;
};

const parseCsvHeader = (header: string[]): void => {
  if (header.length !== CSV_COLUMNS.length) {
    throw new Error(INVALID_CSV_MESSAGE);
  }

  const normalizedHeader = header.map((value, index) =>
    (index === 0 ? value.replace(/^\uFEFF/, '') : value).trim(),
  );

  const isValidHeader = CSV_COLUMNS.every((column, index) => normalizedHeader[index] === column);

  if (!isValidHeader) {
    throw new Error(INVALID_CSV_MESSAGE);
  }
};

const parseCsvDataRow = (row: string[]): CsvRow => {
  if (row.length !== CSV_COLUMNS.length) {
    throw new Error(INVALID_CSV_ROW_MESSAGE);
  }

  const entryType = row[0].trim();
  if (entryType !== 'quest' && entryType !== 'completed_quest') {
    throw new Error(INVALID_CSV_ROW_MESSAGE);
  }

  const title = row[1].trim();
  if (!title) {
    throw new Error(INVALID_CSV_ROW_MESSAGE);
  }

  const description = row[2].trim();
  const createdAt = row[3].trim();
  const completedAt = row[4].trim();
  const reflection = row[5];
  const isToday = parseBooleanCell(row[6]);
  const isFavorite = parseBooleanCell(row[7]);

  if (entryType === 'quest' && !createdAt) {
    throw new Error(INVALID_CSV_ROW_MESSAGE);
  }

  if (entryType === 'completed_quest' && !completedAt) {
    throw new Error(INVALID_CSV_ROW_MESSAGE);
  }

  return {
    entryType,
    title,
    description,
    createdAt,
    completedAt,
    reflection,
    isToday,
    isFavorite,
  };
};

export function stringifyQuestDataCsvExport(snapshot: QuestDataSnapshot): string {
  const preparedSnapshot = createQuestDataSnapshot(snapshot);
  const questById = new Map(preparedSnapshot.quests.map((quest) => [quest.id, quest]));
  const rows: string[] = [CSV_COLUMNS.join(',')];

  preparedSnapshot.quests.forEach((quest) => {
    const csvRow = [
      'quest',
      quest.title,
      quest.description,
      quest.createdAt,
      '',
      '',
      quest.id === preparedSnapshot.todayQuestId ? 'true' : 'false',
      quest.isFavorite ? 'true' : 'false',
    ];

    rows.push(csvRow.map(escapeCsvValue).join(','));
  });

  preparedSnapshot.completions.forEach((completion) => {
    const linkedQuest = questById.get(completion.questId);
    const description =
      linkedQuest && linkedQuest.title === completion.questTitle ? linkedQuest.description : '';
    const csvRow = [
      'completed_quest',
      completion.questTitle,
      description,
      '',
      completion.completedAt,
      completion.reflection,
      'false',
      'false',
    ];

    rows.push(csvRow.map(escapeCsvValue).join(','));
  });

  return rows.join('\n');
}

export function parseQuestDataCsvImport(csvText: string): QuestDataSnapshot {
  const parsedRows = parseCsvRows(csvText);

  if (parsedRows.length === 0) {
    throw new Error(INVALID_CSV_MESSAGE);
  }

  parseCsvHeader(parsedRows[0]);

  const discoveredQuestRecords = new Map<string, CsvQuestRecord>();
  const completions: QuestCompletion[] = [];
  let todayQuestIdentity: string | null = null;

  parsedRows.slice(1).forEach((row) => {
    const parsedRow = parseCsvDataRow(row);
    const questIdentity = normalizeQuestIdentity(parsedRow.title, parsedRow.description);
    const existingQuestRecord = discoveredQuestRecords.get(questIdentity);

    if (!existingQuestRecord) {
      discoveredQuestRecords.set(questIdentity, {
        quest: {
          id: crypto.randomUUID(),
          title: parsedRow.title,
          description: parsedRow.description,
          createdAt:
            parsedRow.entryType === 'quest' ? parsedRow.createdAt : parsedRow.completedAt,
          isSample: false,
          isFavorite: parsedRow.isFavorite,
        },
        hasQuestRow: parsedRow.entryType === 'quest',
      });
    } else {
      if (parsedRow.entryType === 'quest' && !existingQuestRecord.hasQuestRow) {
        existingQuestRecord.quest.createdAt = parsedRow.createdAt;
        existingQuestRecord.hasQuestRow = true;
      }

      if (parsedRow.isFavorite) {
        existingQuestRecord.quest.isFavorite = true;
      }
    }

    const quest = discoveredQuestRecords.get(questIdentity)?.quest;
    if (!quest) {
      throw new Error(INVALID_CSV_ROW_MESSAGE);
    }

    if (parsedRow.isToday) {
      if (!todayQuestIdentity) {
        todayQuestIdentity = questIdentity;
      } else if (todayQuestIdentity !== questIdentity) {
        throw new Error(INVALID_CSV_TODAY_CONFLICT_MESSAGE);
      }
    }

    if (parsedRow.entryType === 'completed_quest') {
      completions.push({
        id: crypto.randomUUID(),
        questId: quest.id,
        questTitle: parsedRow.title,
        completedAt: parsedRow.completedAt,
        reflection: parsedRow.reflection,
      });
    }
  });

  const quests = Array.from(discoveredQuestRecords.values()).map((record) => record.quest);
  const todayQuestId = todayQuestIdentity
    ? (discoveredQuestRecords.get(todayQuestIdentity)?.quest.id ?? null)
    : null;

  return createQuestDataSnapshot({
    quests,
    todayQuestId,
    completions,
  });
}

const parseQuest = (value: unknown): Quest => {
  if (!isRecord(value)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (
    !hasText(value.id) ||
    !hasText(value.title) ||
    !hasString(value.description) ||
    !hasText(value.createdAt)
  ) {
    throw new Error('This backup contains an invalid quest entry.');
  }

  if (typeof value.isSample !== 'undefined' && typeof value.isSample !== 'boolean') {
    throw new Error('This backup contains an invalid quest entry.');
  }

  if (typeof value.isFavorite !== 'undefined' && typeof value.isFavorite !== 'boolean') {
    throw new Error('This backup contains an invalid quest entry.');
  }

  return {
    id: value.id,
    title: value.title,
    description: value.description,
    createdAt: value.createdAt,
    ...(typeof value.isSample === 'boolean' ? { isSample: value.isSample } : {}),
    ...(typeof value.isFavorite === 'boolean' ? { isFavorite: value.isFavorite } : {}),
  };
};

const parseCompletion = (value: unknown): QuestCompletion => {
  if (!isRecord(value)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (
    !hasText(value.id) ||
    !hasText(value.questId) ||
    !hasText(value.questTitle) ||
    !hasText(value.completedAt) ||
    !hasString(value.reflection)
  ) {
    throw new Error('This backup contains an invalid completion entry.');
  }

  return {
    id: value.id,
    questId: value.questId,
    questTitle: value.questTitle,
    completedAt: value.completedAt,
    reflection: value.reflection,
  };
};

export function parseQuestDataImport(jsonText: string): QuestDataSnapshot {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(INVALID_JSON_MESSAGE);
  }

  if (!isRecord(parsed)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (!Array.isArray(parsed.quests) || !Array.isArray(parsed.completions)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  if (parsed.todayQuestId !== null && !hasText(parsed.todayQuestId)) {
    throw new Error(INVALID_EXPORT_MESSAGE);
  }

  const quests = parsed.quests.map(parseQuest);
  const completions = parsed.completions.map(parseCompletion);
  const todayQuestId = typeof parsed.todayQuestId === 'string' ? parsed.todayQuestId : null;

  if (todayQuestId && !quests.some((quest) => quest.id === todayQuestId)) {
    throw new Error('This backup references a today quest that does not exist.');
  }

  return createQuestDataSnapshot({
    quests,
    todayQuestId,
    completions,
  });
}
