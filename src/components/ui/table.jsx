import React from 'react';

export const Table = React.forwardRef(({ className = '', ...props }, ref) => <table ref={ref} className={`w-full text-sm ${className}`} {...props} />);
export const TableHeader = React.forwardRef(({ className = '', ...props }, ref) => <thead ref={ref} className={className} {...props} />);
export const TableBody = React.forwardRef(({ className = '', ...props }, ref) => <tbody ref={ref} className={className} {...props} />);
export const TableFooter = React.forwardRef(({ className = '', ...props }, ref) => <tfoot ref={ref} className={className} {...props} />);
export const TableRow = React.forwardRef(({ className = '', ...props }, ref) => <tr ref={ref} className={className} {...props} />);
export const TableHead = React.forwardRef(({ className = '', ...props }, ref) => <th ref={ref} className={className} {...props} />);
export const TableCell = React.forwardRef(({ className = '', ...props }, ref) => <td ref={ref} className={className} {...props} />);
export const TableCaption = React.forwardRef(({ className = '', ...props }, ref) => <caption ref={ref} className={className} {...props} />);
