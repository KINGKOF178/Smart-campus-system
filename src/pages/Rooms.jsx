import { useEffect, useState } from "react";
import {
  getRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  getBuildings,
  getFloors,
} from "../api/roomApi";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [roomName, setRoomName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [search, setSearch] = useState("");
  console.log("Selected building:", building);
console.log("Floors:", floors);

  useEffect(() => {
  loadRooms();
  loadBuildings();
  loadFloors();
}, []);

  const loadRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadBuildings = async () => {
  try {
    const response = await getBuildings();
    setBuildings(response.data);
  } catch (error) {
    console.error(error);
  }
};

const loadFloors = async () => {
  try {
    const response = await getFloors();
    console.log(response.data);
    setFloors(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const handleAdd = async () => {
    if (!building || !floor || !roomName) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    await addRoom({
      building,
      floor: Number(floor),
      roomName,
    });
       alert("✅ Room added successfully!");

    loadRooms();

    setBuilding("");
    setFloor("");
    setRoomName("");
  };

  const handleEdit = (room) => {
    setBuilding(room.building);
    setFloor(room.floor);
    setRoomName(room.roomName);
    setEditingId(room.id);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    await updateRoom(editingId, {
      building,
      floor: Number(floor),
      roomName,
    });
       alert("✅ Room updated successfully!");

    loadRooms();

    setBuilding("");
    setFloor("");
    setRoomName("");
    setEditingId(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this room?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteRoom(id);
    alert("✅ Room deleted successfully!");
    await loadRooms();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container mt-4">
      <h2>Rooms</h2>

<p className="page-description">
  Manage rooms for every floor.
</p>

      <div className="card p-3 mb-4">

       <select
  className="form-control mb-2"
  value={building}
  onChange={(e) => setBuilding(e.target.value)}
>
  <option value="">Select Building</option>

  {buildings.map((b) => (
    <option key={b.id} value={b.name}>
      {b.name}
    </option>
  ))}
</select>

        <select
  className="form-control mb-2"
  value={floor}
  onChange={(e) => setFloor(e.target.value)}
>
  <option value="">Select Floor</option>

  {floors
    .filter((f) => f.building === building)
    .map((f) => (
      <option key={f.id} value={f.floorNumber}>
        Floor {f.floorNumber}
      </option>
    ))}
</select>



        <input
          className="form-control mb-3"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />

        {isEditing ? (
          <button
            className="btn btn-success"
            onClick={handleUpdate}
          >
            Update Room
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleAdd}
          >
            Add Room
          </button>
        )}
      </div>

      <input
  className="form-control mb-3"
  placeholder="🔍 Search rooms..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Building</th>
            <th>Floor</th>
            <th>Room</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rooms
            .filter(
              (room) =>
                room.roomName.toLowerCase().includes(search.toLowerCase()) ||
                room.building.toLowerCase().includes(search.toLowerCase())
            )
            .map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.building}</td>
              <td>{room.floor}</td>
              <td>{room.roomName}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(room)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(room.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Rooms;