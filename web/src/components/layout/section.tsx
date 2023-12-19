export const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="bg-neutral-300 border border-neutral-400 dark:border-0 dark:bg-neutral-800 px-5 py-4 rounded-lg">
    {children}
  </section>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 font-bold text-lg tracking-wide">{children}</h2>
);
