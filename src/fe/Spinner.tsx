
export function Spinner(props: {
  height?: string;
  width?: string;
}) {
  const height = props.height ?? 'auto';
  const width = props.width ?? 'auto';
  return (
    <img
      style={{
        height,
        width,
      }}
      src='images/spinner.gif'
      alt="loading"
    />
  );
}
