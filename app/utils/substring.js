export default function substring(string, length) {
  if (string.length < length) {
    return string;
  }
  var idx = string.lastIndexOf(' ', length);
  if (idx === -1){
    return string.substring(0, length);
  }
  return string.substring(0, idx);
}
