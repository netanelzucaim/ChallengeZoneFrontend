import { useState } from "react";

interface ItemsListProps {
    title: string,
    items: string[],
    onItemSelected: (index: number) => void
}

function ItemsList({ title, items, onItemSelected }: ItemsListProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [render, setRender] = useState(0);

    console.log("PostsList component");

    const onSelect = (index: number) => {
        console.log("click ", index)
        setSelectedIndex(index);
    }

    const onAdd = () => {
        console.log("add")
        items.push("A new item");
        setRender(render + 1);
    }

    const onSelectComplete = () => {
        console.log("select complete")
        onItemSelected(selectedIndex);
    }

    return (
        <>
            <h2>{title}</h2>
            {items.length == 0 && <p>No items</p>}
            {items.length != 0 &&
                <ul className="list-group">
                    {items.map((item, index) => {
                        return <li
                            key={index}
                            className={selectedIndex == index ? "list-group-item active" : "list-group-item"}
                            onClick={() => { onSelect(index) }}
                        >
                            {index}: {item}
                        </li>
                    })}
                </ul >}
            <button className="btn btn-primary m-3" onClick={() => { onAdd() }}>Add</button>
            <button className="btn btn-primary" onClick={() => { onSelectComplete() }}>Select</button>
        </>
    );

}

export default ItemsList;