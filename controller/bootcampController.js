const createBootcamp = async (req, res) => {
  res.status(201).json({ success: true, msg: "Create a new bootcamp" });
};

const getAllBootcamps = async (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

const getSingleBootcamp = async (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show single bootcamp ${req.params.id}` });
};

const updateBootcamp = async (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update a bootcamp ${req.params.id}` });
};

const deleteBootcamp = async (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete a bootcamp ${req.params.id}` });
};

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
