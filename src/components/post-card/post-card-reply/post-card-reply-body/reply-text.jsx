import TextareaAutosize from "react-textarea-autosize"

export default function ReplyText(
  {
    text,
    setText,
  }
) 

{
  return (
    <>
      <TextareaAutosize
        className='w-full p-2.5 overflow-hidden overflow-y-hidden overflow-x-hidden resize-none outline-none bg-transparent focus:border focus:rounded-md'
        minRows={1}
        maxRows={5}
        placeholder='Reply with ...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </>
  );
}