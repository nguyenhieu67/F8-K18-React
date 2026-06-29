import { CalendarRangeIcon, ImageIcon, SavedIcon } from "@/components/Icons";

interface Props {
  setMenu: (menu: string) => void;
  onSaved: () => void
}

export default function EditCardMenu({ setMenu, onSaved }: Props) {

  const cardEditMenus = [
    {
      id: 1,
      title: "Thay đổi bìa",
      icon: <ImageIcon size="16" />,
      onClick: () => { setMenu('upload-image') },
    },
    {
      id: 2,
      title: "Chỉnh sửa ngày",
      icon: <CalendarRangeIcon size="16" />,
      onClick: () => { },
    },
    {
      id: 3,
      title: "Lưu trữ",
      icon: <SavedIcon size="16" />,
      onClick: onSaved,
    },
  ]

  return (
    <>
      <ul className="flex flex-col gap-1">
        {cardEditMenus.map(item => (
          <li key={item.id}>
            <button className="flex items-center gap-1.5 py-1 px-3 w-fit cursor-pointer bg-[#F0F1F2] text-[#292A2E] rounded-md hover:bg-[#DDDEE1] dark:bg-[#303134] dark:text-[#CECFD2] dark:hover:bg-[#4B4D51]"
              onClick={item.onClick}
            >
              <span>{item.icon}</span>
              <p>{item.title}</p>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
