"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { IconHeart, IconHeartFilled } from "@/components/icons";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import {
  SHORTLIST_CHANGE_EVENT,
  addToShortlist,
  isInShortlist,
  removeFromShortlist,
} from "@/lib/shortlist";

type ShortlistButtonProps = {
  propertyCode: string;
  className?: string;
};

export const ShortlistButton = memo(function ShortlistButton({
  propertyCode,
  className,
}: ShortlistButtonProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const syncState = useCallback(() => {
    setAdded(isInShortlist(propertyCode));
  }, [propertyCode]);

  useEffect(() => {
    syncState();

    const handleChange = () => syncState();
    window.addEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [syncState]);

  const handleAdd = () => {
    addToShortlist(propertyCode);
    toast.success(t("toast.addedShortlist"));
  };

  const handleConfirmRemove = () => {
    removeFromShortlist(propertyCode);
    setConfirmOpen(false);
    toast.success(t("toast.removedShortlist"));
  };

  return (
    <>
      {added ? (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className={getButtonClassName("ghost", "md", className ?? "w-full")}
          aria-pressed="true"
        >
          <IconHeartFilled size={18} className="shrink-0 text-primary" />
          {t("card.addedShortlist")}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          className={getButtonClassName("primary", "md", className ?? "w-full")}
          aria-pressed="false"
        >
          <IconHeart size={18} className="shrink-0" />
          {t("card.addShortlist")}
        </button>
      )}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("modal.removeProperty.title")}
        description={t("modal.removeProperty.body")}
        confirmLabel={t("modal.confirm")}
        cancelLabel={t("modal.cancel")}
        onConfirm={handleConfirmRemove}
        variant="destructive"
      />
    </>
  );
});
