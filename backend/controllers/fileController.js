const File = require('../models/File');
const Folder = require('../models/Folder');

const getFilesAndFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });
    const files = await File.find({ userId: req.user._id });

    res.json({ folders, files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createFile = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    // Validate that name is provided and not empty
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'File name is required' });
    }

    // Sanitize: trim whitespace and ensure .md extension
    const cleanName = name.trim();
    const fileName = cleanName.endsWith('.md') ? cleanName : `${cleanName}.md`;

    // Check for duplicate file names in the same folder
    const existingFile = await File.findOne({
      name: fileName,
      parentId: parentId || null,
      userId: req.user._id
    });
    if (existingFile) {
      return res.status(400).json({ error: 'A file with this name already exists in this location' });
    }

    const file = new File({
      name: fileName,
      content: '# New Document\n\nStart writing here...',
      parentId: parentId || null,
      userId: req.user._id
    });

    await file.save();
    res.status(201).json(file);
  } catch (error) {
    console.error('Create file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    // Validate that name is provided and not empty
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const cleanName = name.trim();

    // Check for duplicate folder names in the same location
    const existingFolder = await Folder.findOne({
      name: cleanName,
      parentId: parentId || null,
      userId: req.user._id
    });
    if (existingFolder) {
      return res.status(400).json({ error: 'A folder with this name already exists in this location' });
    }

    const folder = new Folder({
      name: cleanName,
      parentId: parentId || null,
      userId: req.user._id,
      isOpen: false
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating userId or _id
    delete updates.userId;
    delete updates._id;

    const file = await File.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updates,
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating userId or _id
    delete updates.userId;
    delete updates._id;

    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updates,
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!type || !['file', 'folder'].includes(type)) {
      return res.status(400).json({ error: 'Invalid item type. Must be "file" or "folder"' });
    }

    if (type === 'file') {
      const file = await File.findOneAndDelete({ _id: id, userId: req.user._id });
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
    } else if (type === 'folder') {
      const folder = await Folder.findOne({ _id: id, userId: req.user._id });
      if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
      }
      // Delete folder and all its contents recursively
      await deleteNestedItems(id, req.user._id);
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteNestedItems = async (folderId, userId) => {
  // Find all subfolders
  const subfolders = await Folder.find({ parentId: folderId, userId });
  
  // Recursively delete subfolders
  for (const subfolder of subfolders) {
    await deleteNestedItems(subfolder._id, userId);
  }
  
  // Delete all files in this folder
  await File.deleteMany({ parentId: folderId, userId });
  
  // Delete the folder itself
  await Folder.findByIdAndDelete(folderId);
};

module.exports = {
  getFilesAndFolders,
  createFile,
  createFolder,
  updateFile,
  updateFolder,
  deleteItem
}; 