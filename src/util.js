
export function plural(count, label) {
  return `${count} ${label + (count===1?"":"s")}`
}

const labels = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"]
export function byteLabel(n) {
  if (!n) return "-"

  // if over 999.99
  for (var i in labels) {
    var val = n/Math.pow(1024, i)
    if (val >= 1000) {
      continue
    }
    break
  }

  return val.toFixed(1) + " " + labels[i] + "/sec"
}
