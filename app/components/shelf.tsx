import { ScrollArea } from "./ui/scroll-area";

export function Shelf({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl text-white">{title}</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-2">{children}</div>
      </ScrollArea>
    </section>
  );
}