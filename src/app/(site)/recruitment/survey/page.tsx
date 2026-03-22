"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  MoreVertical,
  GripVertical,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { useUpdate } from "@/hooks/use-update";
import { Loader } from "@/components/ui/loader";
import { SurveyTemplateDialog } from "@/components/recruitment/SurveyTemplateDialog";
import { SurveyQuestionDialog } from "@/components/recruitment/SurveyQuestionDialog";

interface SurveyQuestion {
  _id: string;
  text: string;
  type: string;
}

interface SurveyTemplate {
  _id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

function TemplateRow({
  template,
  onEdit,
  onDelete,
  onAddQuestion,
  onDeleteQuestion,
}: {
  template: SurveyTemplate;
  onEdit: (t: SurveyTemplate) => void;
  onDelete: (id: string) => void;
  onAddQuestion: (t: SurveyTemplate) => void;
  onDeleteQuestion: (templateId: string, questionId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const questionsCount = template.questions?.length || 0;

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex size-5 items-center justify-center text-muted-foreground">
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </div>
        <Plus className="size-4 text-primary" />
        <span className="flex-1 text-sm font-medium">{template.title}</span>
        <Badge
          className={cn(
            "size-6 items-center justify-center rounded-full p-0 text-[10px] font-bold",
            questionsCount > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {questionsCount}
        </Badge>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={(e) => {
              e.stopPropagation();
              onAddQuestion(template);
            }}
            title="Add Question"
          >
            <Plus className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template);
            }}
          >
            <Pencil className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template._id);
            }}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </button>
      {expanded && questionsCount > 0 && (
        <div className="border-t border-border/30 bg-muted/20 px-4 py-2">
          <div className="space-y-1">
            {template.questions.map((q, i) => (
              <div
                key={q._id || i}
                className="group/question flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-background"
              >
                <GripVertical className="size-3.5 text-muted-foreground/50" />
                <span className="text-xs font-medium text-muted-foreground w-6">
                  {i + 1}.
                </span>
                <span className="flex-1">{q.text}</span>
                <Badge variant="outline" className="text-[10px]">
                  {q.type.replace("_", " ")}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 group-hover/question:opacity-100"
                  onClick={() => onDeleteQuestion(template._id, q._id)}
                >
                  <Trash2 className="size-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {expanded && questionsCount === 0 && (
        <div className="border-t border-border/30 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
          <p>No questions yet.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddQuestion(template)}
          >
            Add Question
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SurveyPage() {
  const [search, setSearch] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SurveyTemplate | null>(
    null,
  );
  const [selectedTemplateForQuestion, setSelectedTemplateForQuestion] =
    useState<SurveyTemplate | null>(null);

  const {
    data: templates = [],
    loading,
    refetch,
  } = useList<SurveyTemplate>("/survey-templates");
  const { delete: deleteTemplate } = useDelete("/survey-templates");
  const { update } = useUpdate("/survey-templates");

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  const allQuestions = templates.flatMap((t) =>
    (t.questions || []).map((q) => ({ ...q, templateName: t.title })),
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const success = await deleteTemplate(id);
      if (success) refetch();
    }
  };

  const handleDeleteQuestion = async (
    templateId: string,
    questionId: string,
  ) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const template = templates.find((t) => t._id === templateId);
      if (!template) return;

      const newQuestions = template.questions.filter(
        (q) => q._id !== questionId,
      );
      const success = await update(
        templateId,
        { questions: newQuestions },
        { successMessage: "Question deleted" },
      );
      if (success) refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Survey Templates
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage recruitment survey question templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="size-3.5" />
            Templates
            <Badge className="ml-1 size-5 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground">
              {filtered.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2">
            Questions
            <Badge className="ml-1 size-5 items-center justify-center rounded-full bg-muted p-0 text-[10px] text-muted-foreground">
              {allQuestions.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {filtered.length} Template{filtered.length !== 1 ? "s" : ""}
              </CardTitle>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => {
                  setEditingTemplate(null);
                  setTemplateDialogOpen(true);
                }}
              >
                <Plus className="size-3.5" />
                New Template
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                  <FileText className="size-10 text-muted-foreground/50" />
                  <p>No templates found</p>
                </div>
              ) : (
                filtered.map((template) => (
                  <TemplateRow
                    key={template._id}
                    template={template}
                    onEdit={(t) => {
                      setEditingTemplate(t);
                      setTemplateDialogOpen(true);
                    }}
                    onDelete={handleDelete}
                    onAddQuestion={(t) => {
                      setSelectedTemplateForQuestion(t);
                      setQuestionDialogOpen(true);
                    }}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                All Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader />
                </div>
              ) : allQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                  <FileText className="size-10 text-muted-foreground/50" />
                  <p>No questions found</p>
                </div>
              ) : (
                allQuestions.map((q, i) => (
                  <div
                    key={q._id || i}
                    className="flex items-center gap-3 border-b border-border/50 px-4 py-3 last:border-0 hover:bg-muted/50"
                  >
                    <span className="text-xs font-medium text-muted-foreground w-6">
                      {i + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{q.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.templateName}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {q.type.replace("_", " ")}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SurveyTemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        template={editingTemplate}
        onSuccess={() => refetch()}
      />

      <SurveyQuestionDialog
        open={questionDialogOpen}
        onOpenChange={setQuestionDialogOpen}
        templateId={selectedTemplateForQuestion?._id || null}
        existingQuestions={selectedTemplateForQuestion?.questions || []}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
