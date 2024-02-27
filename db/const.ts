export const timestampOptions = {
  createdAt: 'ctime',
  timestamps: true,
  updatedAt: 'mtime'
};

export const onlyCtime = {
  createdAt: 'ctime',
  timestamps: true,
  updatedAt: false
};

export const enWordRegex = /^[\x20-\x7e’]{1,60}$/;
export const sentenceTextRegex = /^[\x20-\x7e’]{1,500}$/;
