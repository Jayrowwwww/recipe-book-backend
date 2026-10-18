ALTER TABLE "recipe" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;