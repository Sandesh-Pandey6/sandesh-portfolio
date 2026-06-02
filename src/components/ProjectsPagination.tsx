import Link from "next/link";

const PROJECTS_PER_PAGE = 6;

export { PROJECTS_PER_PAGE };

type ProjectsPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage?: number;
};

export function getProjectsPageSlice<T>(
  items: T[],
  page: number,
  perPage: number = PROJECTS_PER_PAGE
): { items: T[]; currentPage: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage,
    totalPages,
  };
}

function pageHref(page: number): string {
  return page <= 1 ? "/projects" : `/projects?page=${page}`;
}

export default function ProjectsPagination({
  currentPage,
  totalPages,
  totalItems,
  perPage = PROJECTS_PER_PAGE,
}: ProjectsPaginationProps) {
  if (totalPages <= 1) return null;

  const rangeStart = (currentPage - 1) * perPage + 1;
  const rangeEnd = Math.min(currentPage * perPage, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="projects-pagination" aria-label="Projects pagination">
      <p className="projects-pagination__summary">
        Showing {rangeStart}–{rangeEnd} of {totalItems}
      </p>
      <div className="projects-pagination__controls">
        {currentPage > 1 ? (
          <Link
            href={pageHref(currentPage - 1)}
            className="btn-secondary projects-pagination__nav"
          >
            ← Previous
          </Link>
        ) : (
          <span
            className="btn-secondary projects-pagination__nav projects-pagination__nav--disabled"
            aria-hidden
          >
            ← Previous
          </span>
        )}

        <ul className="projects-pagination__pages">
          {pages.map((page) => (
            <li key={page}>
              <Link
                href={pageHref(page)}
                className={
                  page === currentPage
                    ? "projects-pagination__page projects-pagination__page--active"
                    : "projects-pagination__page"
                }
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            </li>
          ))}
        </ul>

        {currentPage < totalPages ? (
          <Link
            href={pageHref(currentPage + 1)}
            className="btn-secondary projects-pagination__nav"
          >
            Next →
          </Link>
        ) : (
          <span
            className="btn-secondary projects-pagination__nav projects-pagination__nav--disabled"
            aria-hidden
          >
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
