export const DotLottieReact = ({
  src,
  loop,
  autoplay,
  style,
  ...props
}: any) => (
  <div
    data-testid="lottie-animation"
    data-src={src}
    data-loop={loop}
    data-autoplay={autoplay}
    style={style}
    {...props}
  >
    Mocked Lottie Animation
  </div>
);
