import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  const handleToastClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement = event.target as HTMLElement | null;
    if (!clickedElement) {
      return;
    }

    if (
      clickedElement.closest(
      '[data-button], [data-close-button], button, a, input, textarea, select, [role="button"]',
      )
    ) {
      return;
    }

    const toastElement = clickedElement.closest<HTMLElement>("[data-sonner-toast]");
    if (!toastElement) {
      return;
    }

    const toastIndex = Number(toastElement.dataset.index);
    const clickedToast = toast.getToasts()[toastIndex];
    if (
      Number.isFinite(toastIndex) &&
      clickedToast &&
      !("dismiss" in clickedToast && clickedToast.dismiss)
    ) {
      toast.dismiss(clickedToast.id);
      return;
    }

    toast.dismiss();
  };

  return (
    <div onClick={handleToastClick}>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    </div>
  );
};

export { Toaster, toast };
