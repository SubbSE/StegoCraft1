import { Link } from 'react-router-dom';
import { buttonClass } from './buttonClass';

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

export function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={buttonClass({ variant: 'ghost', size: 'icon', className })}
      {...props}
    >
      {children}
    </button>
  );
}
