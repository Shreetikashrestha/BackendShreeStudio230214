import { ServicesModel as Services } from "../../models/index.js"; // Fixed import

// Get all services
export const findAll = async (req, res) => {
  try {
    const services = await Services.findAll();
    res
      .status(200)
      .json({ data: services, message: "Services retrieved successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving services", error: err.message });
  }
};

// Save a new service
export const save = async (req, res) => {
  try {
    const { Servicename, Description, Price } = req.body; // Changed to match model

    if (!Servicename || !Description || !Price) {
      return res
        .status(400)
        .json({ message: "Servicename, Description, and Price are required" });
    }

    const services = await Services.create({ Servicename, Description, Price });

    res
      .status(201)
      .json({ data: services, message: "Service created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving service", error: err.message });
  }
};

// Get service by ID
export const findById = async (req, res) => {
  try {
    const services = await Services.findByPk(req.params.id);
    if (services) {
      res
        .status(200)
        .json({ data: services, message: "Service retrieved successfully" });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving service", error: err.message });
  }
};

// Delete service by ID
export const deleteById = async (req, res) => {
  try {
    const services = await Services.findByPk(req.params.id);
    if (services) {
      await services.destroy();
      res.status(200).json({ message: "Service deleted successfully" });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: err.message });
  }
};

// Update service by ID
export const update = async (req, res) => {
  try {
    console.log(req.params.id);
    const services = await Services.findByPk(req.params.id);
    console.log(services);
    if (!services) {
      return res.status(404).json({ message: "Service not found" });
    }

    const { Servicename, Description, Price } = req.body; // Changed to match model

    await services.update({ Servicename, Description, Price });
    res
      .status(200)
      .json({ data: services, message: "Service updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating service", error: err.message });
  }
};
