import { useState } from "react";

interface Post {
    _id: string,
    content: string,
    sender: string,
    avatarUrl: string,
    postPic?: string, // Make postPic optional
    username: string
}

interface ItemsListProps {
    items: Post[],
    onItemSelected: (index: number) => void
}

function ItemsList({ items, onItemSelected }: ItemsListProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [render, setRender] = useState(0);

    console.log("PostsList component");

    const onSelect = (index: number) => {
        console.log("click ", index)
        setSelectedIndex(index);
    }

    const onAdd = () => {
        console.log("add")
        setRender(render + 1);
    }

    const onSelectComplete = () => {
        console.log("select complete")
        onItemSelected(selectedIndex);
    }

    return (
        <>
            {items.length === 0 && <p>No items</p>}
            {items.length !== 0 &&
                <ul className="list-group">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${selectedIndex === index ? "active" : ""}`}
                            onClick={() => { onSelect(index) }}
                        >
                            <div className="d-flex align-items-center">
                                <img src={item.avatarUrl} alt="avatar" className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
                                <div>
                                    <h5 className="mb-1">{item.username}</h5>
                                </div>
                            </div>
                            {item.postPic && <img src={item.postPic} alt="post" className="img-fluid mt-2" />}
                            <p className="mb-1">{item.content}</p>
                        </li>
                    ))}
                </ul>
            }
            <button className="btn btn-primary m-3" onClick={onAdd}>Add</button>
            <button className="btn btn-primary" onClick={onSelectComplete}>Select</button>
        </>
    );
}

export default ItemsList;