"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MAX_ASSIGNMENT_FILES, MAX_ASSIGNMENT_FILE_SIZE_BYTES } from "@/lib/assignments/files";
import { useUser } from "@/context/UserProvider";
import { useUserAssignments } from "@/context/UserAssignmentsProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TaskCreateForm() {
    const router = useRouter();
    const { user } = useUser();
    const { createAssignment, uploadFiles, creatingAssignment, uploadingForAssignmentId } =
        useUserAssignments();

    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [deliveryDeadline, setDeliveryDeadline] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const totalSize = useMemo(
        () => files.reduce((sum, file) => sum + file.size, 0),
        [files]
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (files.length > MAX_ASSIGNMENT_FILES) {
            toast.error(`You can upload up to ${MAX_ASSIGNMENT_FILES} files`);
            return;
        }

        for (const file of files) {
            if (file.size > MAX_ASSIGNMENT_FILE_SIZE_BYTES) {
                toast.error(`${file.name} exceeds the 10 MB limit`);
                return;
            }
        }

        const createResult = await createAssignment({
            title,
            description,
            subject,
            deliveryDeadline: new Date(deliveryDeadline).toISOString(),
        });

        if (!createResult.success || !createResult.assignmentId) {
            toast.error(createResult.message || "Failed to create task");
            return;
        }

        if (files.length > 0) {
            const uploadResult = await uploadFiles(createResult.assignmentId, files);

            if (!uploadResult.success) {
                toast.error(uploadResult.message || "Task created but file upload failed");
                router.push(`/u/${user?.username}/tasks/${createResult.assignmentId}`);
                return;
            }
        }

        toast.success("Task submitted successfully");
        router.push(`/u/${user?.username}/tasks/${createResult.assignmentId}`);
    }

    return (
        <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Machine Learning Assignment"
                                required
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                                placeholder="Computer Science"
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Delivery Deadline</label>
                        <Input
                            type="datetime-local"
                            value={deliveryDeadline}
                            onChange={(event) => setDeliveryDeadline(event.target.value)}
                            required
                            className="h-11 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Add all assignment instructions, requirements, references, and any extra notes."
                            required
                            className="min-h-36 rounded-xl"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Files</label>
                        <Input
                            type="file"
                            multiple
                            onChange={(event) =>
                                setFiles(Array.from(event.target.files || []).slice(0, MAX_ASSIGNMENT_FILES))
                            }
                            className="rounded-xl"
                        />
                        <div className="text-sm text-muted-foreground">
                            Up to {MAX_ASSIGNMENT_FILES} files, max 10 MB each.
                        </div>
                        {files.length > 0 ? (
                            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                                <div>{files.length} selected file{files.length === 1 ? "" : "s"}</div>
                                <div>Total size: {(totalSize / (1024 * 1024)).toFixed(1)} MB</div>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="h-11 rounded-xl px-6"
                            disabled={creatingAssignment || Boolean(uploadingForAssignmentId)}
                        >
                            {creatingAssignment || uploadingForAssignmentId ? "Submitting..." : "Submit Task"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}