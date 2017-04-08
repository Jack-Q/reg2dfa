
Set.prototype.addSet = function (s) {
  for (let ele of s) this.add(ele);
  return this;
}

Set.prototype.eq = function (s) {
  if (!s || this.size !== s.size) 
    return false;
  for (let ele of this) 
    if (!s.has(ele)) 
      return false;
  return true;
}

Set.prototype.diff = function (s) {
  for (let ele of s) {
    if (this.has(ele))
      this.delete(ele);  
  }
  return this;
}

Set.prototype.subset = function (pred) {
  const s = new Set();
  for (let ele of this)
    if (pred(ele))
      s.add(ele);
  return s;
}

Set.prototype.subsetOf = function (s) {
  for (let ele of this)
    if (!s.has(ele))
      return false;
  return true;
}

export const EPS = -1;

export const trans = (src, dest, label) => ({ src, dest, label });
