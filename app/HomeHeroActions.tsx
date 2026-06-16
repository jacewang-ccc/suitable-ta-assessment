"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, RotateCcw } from "lucide-react";

const storageKey = "suitable-ta-answers";
const unlockKey = "suitable-ta-unlocked";
const draftKey = "suitable-ta-draft";
const demoKey = "suitable-ta-demo-report";

const hasUsableDraft = () => {
  if (typeof window === "undefined") return false;
  const storedDraft = window.localStorage.getItem(draftKey);
  if (!storedDraft) return false;

  try {
    const draft = JSON.parse(storedDraft) as { answers?: Record<string, unknown> };
    return Boolean(draft.answers && Object.keys(draft.answers).length > 0);
  } catch {
    window.localStorage.removeItem(draftKey);
    return false;
  }
};

export function HomeNavAssessmentAction() {
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setHasDraft(hasUsableDraft());
  }, []);

  return (
    <Link className="primary-button nav-cta" href="/assessment">
      {hasDraft ? "继续测评" : "免费开始测评"}
    </Link>
  );
}

export function HomeHeroActions() {
  const router = useRouter();
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setHasDraft(hasUsableDraft());
  }, []);

  const restartAssessment = () => {
    window.localStorage.removeItem(draftKey);
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(unlockKey);
    window.localStorage.removeItem(demoKey);
    router.push("/assessment");
  };

  if (hasDraft) {
    return (
      <div className="hero-actions">
        <Link className="primary-button hero-primary" href="/assessment">
          继续测评
          <ArrowRight size={20} strokeWidth={2.4} />
        </Link>
        <button className="outline-button hero-secondary hero-reset-button" onClick={restartAssessment} type="button">
          <RotateCcw size={21} />
          重新开始测评
        </button>
      </div>
    );
  }

  return (
    <div className="hero-actions">
      <Link className="primary-button hero-primary" href="/assessment">
        免费开始测评
        <ArrowRight size={20} strokeWidth={2.4} />
      </Link>
      <Link className="outline-button hero-secondary" href="/report-samples">
        <FileText size={22} />
        查看报告样例
      </Link>
    </div>
  );
}
