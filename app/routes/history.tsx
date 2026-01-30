import type { Route } from "./+types/history";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function History() {
  return <p>History</p>;
}
