import { useEffect, useState } from "react";
import {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  getBuildings,
  getFloors,
  getRooms,
} from "../api/deviceApi";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [powerRating, setPowerRating] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [floor, setFloor] = useState("");
  const [search, setSearch] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");

  useEffect(() => {
    loadDevices();
    loadBuildings();
    loadFloors();
    loadRooms();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await getDevices();
      setDevices(response.data);
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
    setFloors(response.data);
  } catch (error) {
    console.error(error);
  }
};

const loadRooms = async () => {
  try {
    const response = await getRooms();
    setRooms(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const handleAdd = async () => {
  if (!building || !floor || !room || !deviceName || !powerRating || !hoursPerDay) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  try {
    await addDevice({
      building,
      floor: Number(floor),
      room,
      deviceName,
      powerRating: Number(powerRating),
      hoursPerDay: Number(hoursPerDay),
    });

    alert("✅ Device added successfully!");

    await loadDevices();

    setBuilding("");
    setFloor("");
    setRoom("");
    setDeviceName("");
    setPowerRating("");
    setHoursPerDay("");

  } catch (error) {
    console.error(error);
    alert("❌ Failed to add device");
  }
};

  const handleEdit = (device) => {
    setBuilding(device.building);
    setFloor(device.floor);
    setRoom(device.room);
    setDeviceName(device.deviceName);
    setPowerRating(device.powerRating);
    setHoursPerDay(device.hoursPerDay);
    setEditingId(device.id);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    await updateDevice(editingId, {
      building,
      floor,
      room,
      deviceName,
      powerRating: Number(powerRating),
      hoursPerDay: parseFloat(hoursPerDay),
    });
       alert("✅ Device updated successfully!");

    await loadDevices();

    setBuilding("");
    setFloor("");
    setRoom("");
    setDeviceName("");
    setPowerRating("");
    setHoursPerDay("");
    setEditingId(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this device?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteDevice(id);
    alert("✅ Device deleted successfully!");
    await loadDevices();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container mt-4">
      <h2>Devices</h2>

<p className="page-description">
  Manage electrical devices and power ratings.
</p>
      

      <div className="card p-3 mb-4">
        <select
  className="form-control mb-2"
  value={building}
  onChange={(e) => {
    setBuilding(e.target.value);
    setFloor("");
    setRoom("");
  }}
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
  onChange={(e) => {
    setFloor(e.target.value);
    setRoom("");
  }}
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

<select
  className="form-control mb-2"
  value={room}
  onChange={(e) => setRoom(e.target.value)}
>
  <option value="">Select Room</option>

  {rooms
    .filter(
      (r) =>
        r.building === building &&
        String(r.floor) === String(floor)
    )
    .map((r) => (
      <option key={r.id} value={r.roomName}>
        {r.roomName}
      </option>
    ))}
</select>

        <input
          className="form-control mb-2"
          placeholder="Device Name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Power Rating (Watts)"
          value={powerRating}
          onChange={(e) => setPowerRating(e.target.value)}
        />

        <input
  className="form-control mb-2"
  type="number"
  placeholder="Hours Used Per Day"
  value={hoursPerDay}
  onChange={(e) => setHoursPerDay(e.target.value)}
/>

        {isEditing ? (
          <button className="btn btn-success" onClick={handleUpdate}>
            Update Device
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Device
          </button>
        )}
      </div>

      <input
  className="form-control mb-3"
  placeholder="🔍 Search devices..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Building</th>
            <th>Room</th>
            <th>Device</th>
            <th>Power Rating (W)</th>
            <th>Hours/Day</th>
            <th>Daily kWh</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {devices
            .filter(
              (device) =>
                device.deviceName.toLowerCase().includes(search.toLowerCase()) ||
                device.building.toLowerCase().includes(search.toLowerCase()) ||
                device.room.toLowerCase().includes(search.toLowerCase())
            )
            .map((device) => (
            <tr key={device.id}>
              <td>{device.id}</td>
              <td>{device.building}</td>
              <td>{device.room}</td>
              <td>{device.deviceName}</td>
              <td>{device.powerRating}</td>
              <td>{device.hoursPerDay}</td>
              <td>
                {((device.powerRating * device.hoursPerDay) / 1000).toFixed(2)}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(device)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(device.id)}
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
export default Devices;