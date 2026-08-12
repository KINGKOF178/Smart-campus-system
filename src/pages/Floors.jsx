import { useEffect, useState } from "react";
import {
  getFloors,
  addFloor,
  updateFloor,
  deleteFloor,
  getBuildings,
} from "../api/floorApi";

function Floors() {
  const [floors, setFloors] = useState([]);
  const [building, setBuilding] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState("");

 useEffect(() => {
  loadFloors();
  loadBuildings();
}, []);

  const loadFloors = async () => {
    try {
      const response = await getFloors();
      setFloors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    if (!building || !floorNumber) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    await addFloor({
      building,
      floorNumber: Number(floorNumber),
    });
     alert("✅ Floor added successfully!");

    loadFloors();
    setBuilding("");
    setFloorNumber("");
  };

  const handleEdit = (floor) => {
    setBuilding(floor.building);
    setFloorNumber(floor.floorNumber);
    setEditingId(floor.id);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    await updateFloor(editingId, {
      building,
      floorNumber: Number(floorNumber),
    });
       alert("✅ Floor updated successfully!");
    loadFloors();
    setBuilding("");
    setFloorNumber("");
    setEditingId(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this floor?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteFloor(id);
    alert("✅ Floor deleted successfully!");
    await loadFloors();
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

  return (
    <div className="container mt-4">
      <h2>Floors</h2>

        <p className="page-description">
          Manage floors for each building.
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
        
        <input
  className="form-control mb-3"
  type="number"
  placeholder="Floor Number"
  value={floorNumber}
  onChange={(e) => setFloorNumber(e.target.value)}
/>

        {isEditing ? (
          <button className="btn btn-success" onClick={handleUpdate}>
            Update Floor
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Floor
          </button>
        )}
      </div>

      <input
  className="form-control mb-3"
  type="text"
  placeholder="🔍 Search floors..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Building</th>
            <th>Floor Number</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {floors
            .filter(
              (floor) =>
                floor.building.toLowerCase().includes(search.toLowerCase()) ||
                String(floor.floorNumber).includes(search)
            )
            .map((floor) => (
            <tr key={floor.id}>
              <td>{floor.id}</td>
              <td>{floor.building}</td>
              <td>{floor.floorNumber}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(floor)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(floor.id)}
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

export default Floors;