"use client";

export type AdminPage = "projects" | "stack" | "hero";

export default function AdminTabsBar({
  active,
  onChange,
  onLogout,
}: {
  active: AdminPage;
  onChange: (page: AdminPage) => void;
  onLogout: () => void;
}) {
  const tabs: { id: AdminPage; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "stack", label: "Tech stack" },
    { id: "hero", label: "Hero stats" },
  ];

  return (
    <div className="admin-tabs-bar">
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={
              active === tab.id
                ? "admin-tabs__btn admin-tabs__btn--active"
                : "admin-tabs__btn"
            }
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <button type="button" className="btn-secondary" onClick={onLogout}>
        Sign out
      </button>
    </div>
  );
}
