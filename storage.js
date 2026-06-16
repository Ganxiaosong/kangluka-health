const STORAGE_KEY = 'kanglukka_records';

const Storage = {
  getRecords: function() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('读取数据失败:', error);
      return [];
    }
  },

  addRecord: function(record) {
    try {
      const records = this.getRecords();
      const newRecord = {
        ...record,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      records.push(newRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return newRecord;
    } catch (error) {
      console.error('添加记录失败:', error);
      return null;
    }
  },

  updateRecord: function(id, updatedRecord) {
    try {
      const records = this.getRecords();
      const index = records.findIndex(record => record.id === id);
      if (index !== -1) {
        records[index] = {
          ...records[index],
          ...updatedRecord,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return records[index];
      }
      return null;
    } catch (error) {
      console.error('更新记录失败:', error);
      return null;
    }
  },

  deleteRecord: function(id) {
    try {
      const records = this.getRecords();
      const filteredRecords = records.filter(record => record.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
      return filteredRecords;
    } catch (error) {
      console.error('删除记录失败:', error);
      return null;
    }
  },

  exportData: function(filename = 'kanglukka_backup.json') {
    try {
      const records = this.getRecords();
      const dataStr = JSON.stringify(records, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('导出数据失败:', error);
      return false;
    }
  },

  importData: function(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  },

  clearAll: function() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  },

  getRecordById: function(id) {
    try {
      const records = this.getRecords();
      return records.find(record => record.id === id) || null;
    } catch (error) {
      console.error('查找记录失败:', error);
      return null;
    }
  },

  getRecordCount: function() {
    return this.getRecords().length;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}

if (typeof window !== 'undefined') {
  window.KangLukkaStorage = Storage;
}