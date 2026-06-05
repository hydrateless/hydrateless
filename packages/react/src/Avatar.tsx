import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** Shown when there is no `src` or the image fails to load. */
  fallback?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

/** Avatar primitive — `hl-avatar` with image + graceful fallback. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt = '', fallback, size, shape, className, children, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <span
      {...rest}
      ref={ref}
      className={['hl-avatar', className].filter(Boolean).join(' ')}
      data-hl-size={size}
      data-hl-shape={shape === 'square' ? 'square' : undefined}
    >
      {showImage ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        (fallback ?? children)
      )}
    </span>
  );
});

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement>;

/** Overlapping stack of avatars. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { className, children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={['hl-avatar-group', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
});
