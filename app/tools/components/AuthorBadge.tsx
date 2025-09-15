import Link from "next/link";
import { Pill, PillAvatar, PillIcon } from "@packages/ui/components/ui/kibo-ui/pill";
import { LucideUserCircle } from "lucide-react";
import { getAuthorById } from "../tools";

export default function AuthorBadge({ authorId }: { authorId: string }) {
  const author = getAuthorById(authorId);

  if (!author) {
    return null;
  }

  return (
    <Link href={`/contributors/${authorId}`} target="_blank" rel="noopener noreferrer" className="inline-block">
      <Pill className="border-border/50 bg-foreground/5 transition-opacity hover:opacity-80">
        {author.profilePictureUrl ? (
          <PillAvatar
            fallback={author.name}
            src={author.profilePictureUrl}
            alt={`${author.name}'s profile picture`}
            className="h-4 w-4"
          />
        ) : (
          <PillIcon icon={LucideUserCircle} className="h-4 w-4" />
        )}
        <span className={`text-muted-foreground text-sm italic`}>{author.name}</span>
      </Pill>
    </Link>
  );
}
