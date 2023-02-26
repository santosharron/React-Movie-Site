import { useEffect, useRef, useState } from "react";

function Select({active, items, onChange}:any){
    const ref = useRef<HTMLDivElement>(null);

    const [visible, setVisible] = useState(false);

    const [selected, setSelected] = useState<number|null>(null);

    function update(newOptionIndex:number){
        if(newOptionIndex === selected){
            return;
        }

        setSelected(newOptionIndex);
        setVisible(false);
        onChange && onChange(items[newOptionIndex].id);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(ref.current && !ref.current.contains(event.target as Node)){
                setVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [ref]);

    useEffect(() => {
        if(typeof active === "number"){
            setSelected(active);
        }
    }, [active]);

    return (
        <div className="select" ref={ref}>
            <div className="select-current" onClick={() => setVisible(!visible)}>
                <p>{typeof selected === "number" ? items[selected].name : "Select"}</p>

                {
                    visible ? 
                    <i className="fa-solid fa-chevron-up"></i> : 
                    <i className="fa-solid fa-chevron-down"></i>
                }
            </div>

            {
                visible && 
                <div className="select-list">
                    {
                        items.map((item:any, index:number) => {
                            return (
                                <div
                                key={item.id}
                                onClick={() => update(index)}
                                className={"select-option"+ ((typeof selected === "number" && selected === index) ? " active" : "")}>
                                    <p>{item.name}</p>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default Select;