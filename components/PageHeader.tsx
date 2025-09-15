interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="from-static-primary via-static-secondary to-static-primary inline-block bg-gradient-to-r bg-clip-text pb-4 text-4xl font-bold text-transparent sm:text-5xl">
        {title}
      </h1>
      <p className="text-muted-foreground mx-4 mt-2 text-lg">{description}</p>
    </div>
  );
}
