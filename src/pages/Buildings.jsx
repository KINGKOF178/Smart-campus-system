import { useEffect, useState } from "react";
import {
  getBuildings,
  getFloors,
  addBuilding as addBuildingApi,
  deleteBuilding as deleteBuildingApi,
  updateBuilding as updateBuildingApi,
} from "../api/buildingApi";

function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    loadBuildings();
    loadFloors();
  }, []);

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

    console.log("Floors:", response.data);
    console.log(Array.isArray(response.data));

    setFloors(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const addBuilding = async () => {
    if (name === "") {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      await addBuildingApi({
  name,
  floors: 0,
});

      alert("✅ Building added successfully!");

      await loadBuildings();

      setName("");
      setFloors("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBuilding = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this building?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteBuildingApi(id);
     alert("✅ Building deleted successfully!");
    await loadBuildings();
  } catch (error) {
    console.error(error);
  }
};

  const editBuilding = (building) => {
    setName(building.name);
    setEditingId(building.id);
    setIsEditing(true);
  };

  const updateBuilding = async () => {
  if (name === "") {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await updateBuildingApi(editingId, {
  name,
  floors: 0,
});
       alert("✅ Building updated successfully!");
    await loadBuildings();

    setName("");
    setEditingId(null);
    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="container mt-4">
      <h2>Buildings</h2>
      <p className="page-description">
  Manage all buildings
</p>

      <div className="card p-3 mb-4">
        <h4>Add Building</h4>

        <input
          className="form-control mb-2"
          type="text"
          placeholder="Building Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {isEditing ? (
          <button
            className="btn btn-success"
            onClick={updateBuilding}
          >
            Update Building
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={addBuilding}
          >
            Add Building
          </button>
        )}
      </div>

      <input
  className="form-control mb-3"
  type="text"
  placeholder="🔍 Search buildings..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Building</th>
            <th>Floors</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {buildings
          .filter((building) =>
            building.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((building) => (
            <tr key={building.id}>
              <td>{building.id}</td>
              <td>{building.name}</td>
              <td>
                {
                  floors.filter(
                    (floor) => floor.building === building.name
                  ).length
                }
              </td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editBuilding(building)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBuilding(building.id)}
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

export default Buildings;