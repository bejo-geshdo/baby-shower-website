//Will show up when claiming a gift

//Will show the name of the item and the name of the person who is claiming it
//Options to confirm or cancel
import { useNameContext } from "../../contexts/name-context";
import { useItemsContext } from "../../contexts/items-context";

type ModalProps = {
  setShowModal: (value: boolean) => void;
  itemSk: string | undefined;
};

const ConfirmItemModal = ({ setShowModal, itemSk }: ModalProps) => {
  const { name } = useNameContext();
  const { items, setItems } = useItemsContext();

  const itemIndex = items.findIndex((i) => i.sk === itemSk);
  const item = items[itemIndex];

  const handleConfirm = async () => {
    const claimStatus = item?.claimed ? "unclaim" : "claim";

    try {
      const response = await fetch(
        `https://dcjxtfwogo54re36b263h2fyhm0cvfku.lambda-url.eu-west-1.on.aws/items/claim?item=${item?.sk}&claimer=${name}&claimType=${claimStatus}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 202) {
        throw new Error("Failed to claim item");
      }

      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...item,
        claimed: !item?.claimed,
        claimedBy: name.nameSha256,
      };
      setItems(updatedItems);

      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Faoled to claim item. Error: " + error);
    }
  };

  if (item?.claimed) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Ångra din present</h2>
          <p>
            Bekräfta att du <b>inte</b> längre kommer köpa {item?.name} till de
            blivande föräldarna.
          </p>
          <div>
            <button disabled={item === undefined} onClick={handleConfirm}>
              Bekräfta
            </button>
            <button onClick={() => setShowModal(false)}>Avbryt</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Bekräfta din present</h2>
          <p>
            Bekräfta att du vill köpa {item?.name} till de blivande föräldarna.
          </p>
          <div>
            <button disabled={item === undefined} onClick={handleConfirm}>
              Bekräfta
            </button>
            <button onClick={() => setShowModal(false)}>Avbryt</button>
          </div>
        </div>
      </div>
    );
  }
};

export default ConfirmItemModal;
