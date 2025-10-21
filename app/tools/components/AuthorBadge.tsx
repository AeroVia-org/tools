import {
  Pill,
  PillAvatar,
  PillIcon,
} from "@packages/ui/components/kibo-ui/pill";
import { LucideUserCircle } from "lucide-react";
import { getAuthorById } from "../tools";

export default function AuthorBadge({ authorId }: { authorId: string }) {
  const author = getAuthorById(authorId);

  if (!author) {
    return null;
  }

  return (
    <div className="inline-block">
      <Pill className="border-border/50 bg-foreground/5">
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
        <span className={`text-muted-foreground text-sm italic`}>
          {author.name}
        </span>
      </Pill>
    </div>
  );
}
