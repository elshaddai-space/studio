export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto flex flex-col items-center justify-center gap-1 h-20 px-4 md:px-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FinPlatform. All rights reserved.
        </p>
         <p className="text-xs text-muted-foreground/80">
          A modern finance solution for your business.
        </p>
      </div>
    </footer>
  );
}
