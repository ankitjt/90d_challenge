const options = document.querySelectorAll(".options")
options.forEach(option => {
  option.addEventListener("click", () => {
    options.forEach(opt => opt.classList.remove("bg-[#333]", "text-white"))
    option.classList.add("bg-[#333]", "text-white")
    let parent = option.closest(".wrapper")
    let daysContent = parent.querySelector(".daysContent")
    let graphContent = parent.querySelector(".graphContent")
    if (option.dataset.option === daysContent.dataset.content) {
      daysContent.classList.remove("hidden")
      graphContent.classList.add("hidden")
    }
    if (option.dataset.option === graphContent.dataset.content) {
      graphContent.classList.remove("hidden")
      daysContent.classList.add("hidden")
    }
  })
})

const dropArrow = document.querySelectorAll(".dropArrow")
dropArrow.forEach(arrow => {
  arrow.addEventListener("click", () => {
    let parentSection = arrow.closest(".parentSection")
    let list = parentSection.querySelector(".list")
    list.classList.toggle("hidden")
    arrow.classList.toggle("rotate-180")
  })

})

const days = 1
const dayList = document.querySelector(".dayList")
const selectedDay = document.querySelector(".selectedDay")

for (let i = 90; i >= days; i--) {

  let count = document.createElement("div")
  count.classList.add("dayNumber", "border-b", "border-b-white", "p-1")
  count.innerHTML = `${i}`
  dayList.appendChild(count)

  count.addEventListener("click", () => {
    selectedDay.textContent = i
    dayList.classList.add("hidden")
    let parentSection = count.closest(".parentSection")
    let arrow = parentSection.querySelector(".dropArrow")
    arrow.classList.add("rotate-0")
  })

}

const habitList = [ "Habit", "Sm", "Dr" ]
const habitListWrapper = document.querySelector(".habitListWrapper")
const selectedHabit = document.querySelector(".selectedHabit")

habitList.forEach(habit => {

  let habitHolder = document.createElement("div")
  habitHolder.classList.add("habitList", "border-b", "border-b-white", "p-1")
  habitHolder.textContent = habit
  habitListWrapper.appendChild(habitHolder)

  habitHolder.addEventListener("click", () => {
    selectedHabit.textContent = habit
    let parentSection = habitHolder.closest(".parentSection")
    let arrow = parentSection.querySelector(".dropArrow")
    arrow.classList.add("rotate-0")
    habitListWrapper.classList.add("hidden")
  })

})

const numberInput = `<input type="number" class="numberInput inputs rounded-lg w-28 bg-slate-200 border border-slate-200 text-sm" placeholder="Count"/>`

const yesNo = `
<select class="inputs rounded-lg bg-slate-200 border-transparent w-28 text-sm font-bold ">
  <option value="select">Select</option>
  <option value="yes">Yes</option>
  <option value="no">No</option>
</select>
`
const statusSection = document.querySelector(".statusSection")
const observer = new MutationObserver(() => {
  statusSection.innerHTML = ""
  statusSection.classList.remove("bg-rose-600", "rounded-lg", "p-2", "text-white")
  const text = selectedHabit.textContent.trim()

  if (text === "Sm") { statusSection.innerHTML = numberInput }
  if (text === "Dr") { statusSection.innerHTML = yesNo }
})
observer.observe(selectedHabit, { childList: true, subtree: true, characterData: true })

const create = document.querySelector(".create")
let formData = {}
create.addEventListener("click", () => {

  let inputs = document.querySelectorAll(".inputs")
  inputs.forEach(input => {
    formData[ "count" ] = input.value
  })

  let selectedValue = document.querySelectorAll(".selectedValue")
  selectedValue.forEach(selected => {
    formData[ selected.dataset.name ] = selected.textContent
  })
  formData[ "entryDate" ] = firebase.firestore.FieldValue.serverTimestamp()
  let date = firebase.firestore.FieldValue.serverTimestamp()

  db.collection("90d_challenge").doc(selectedDay.textContent).set({
    latestEntry: date
  })

  db.collection("90d_challenge").doc(selectedDay.textContent).collection("entries").add(formData)
    .then(() => { alert("Data added.") })
    .catch(err => alert(err.message))

  selectedDay.textContent = "Day"
  selectedHabit.textContent = "Habit"
  statusSection.innerHTML = ""
})

// Getting Data
const showAllHabitData = async () => {
  const progressDetails = document.querySelector(".progressDetails")
  progressDetails.innerHTML = ""
  for (let day = 90; day >= 1; day--) {

    const dbRef = db.collection("90d_challenge").doc(String(day))
    let smTotal = 0
    let drTotal = 0
    let latestEntry = null

    // Getting Date of the latest entry
    dbRef.onSnapshot(docRef => {
      if (docRef.exists) {
        latestEntry = docRef.data().latestEntry || null
      }
    })

    dbRef.collection("entries").onSnapshot(snapshot => {

      smTotal = 0
      drTotal = 0

      snapshot.forEach(doc => {
        let data = doc.data()
        if (data.habit === "Sm") {
          const count = parseInt(data.count)
          if (!isNaN(count)) smTotal += count
        }

        if (data.habit === "Dr") {
          if (data.count === "" || data.count == null) {
            drTotal = "-"
            return
          }

          const val = data.count.toLowerCase()
          if (val === "no") {
            drTotal = typeof drTotal === "number" ? drTotal + 1 : 1
          } else if (val === "yes") {
            drTotal = typeof drTotal === "number" ? drTotal - 1 : -1
          }
        }

      })

      const oldCard = document.querySelector(`[data-day="${day}"]`)
      if (oldCard) oldCard.remove()


      // Only log if there's at least some data
      if (smTotal > 0 || drTotal > 0) {
        let dayNumber = document.createElement("div")
        dayNumber.dataset.day = day
        dayNumber.classList.add("w-full", "rounded-lg", "overflow-hidden", "border", "border-slate-400")
        dayNumber.innerHTML = `
        <div class="dayNumber bg-[#333] text-white p-2 flex items-center justify-between uppercase text-xs">
          <span>Day: ${day}</span>
          <span>Dt: ${latestEntry?.toDate().toLocaleString() || "NA"}</span>
        </div>
        <div class="font-lg p-3 flex items-center justify-between uppercase">
          <div class="smTotal">sm: ${smTotal}</div>
          <div class="drTotal">dr: ${drTotal}</div>
        </div>
      `
        progressDetails.prepend(dayNumber)
      }
    })

  }

}

showAllHabitData()
