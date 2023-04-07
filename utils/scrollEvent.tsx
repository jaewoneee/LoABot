export const scrollToBottom = (ref: any) => {
  const { scrollHeight } = ref?.current as HTMLUListElement;
  (ref.current as HTMLUListElement).scrollTo(0, scrollHeight + 300);
};
