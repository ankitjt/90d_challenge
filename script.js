const options = document.querySelectorAll( ".options" )
options.forEach( option =>
{
  option.addEventListener( "click", () =>
  {
    options.forEach( opt => opt.classList.remove( "bg-[#333]", "text-white" ) )
    option.classList.add( "bg-[#333]", "text-white" )
    let parent = option.closest( ".wrapper" )
    let daysContent = parent.querySelector( ".daysContent" )
    let graphContent = parent.querySelector( ".graphContent" )
    if ( option.dataset.option === daysContent.dataset.content )
    {
      daysContent.classList.remove( "hidden" )
      graphContent.classList.add( "hidden" )
    }
    if ( option.dataset.option === graphContent.dataset.content )
    {
      graphContent.classList.remove( "hidden" )
      daysContent.classList.add( "hidden" )
    }
  } )
} )

const days = 91
const dayContent = document.querySelector( ".dayContent" )

for ( let i = 1;i <= days;i++ )
{
  let tableData = document.createElement( "div" )
  tableData.classList.add( "tableRow", "grid", "grid-cols-3", "items-center", "odd:bg-slate-100", "p-3", "rounded-lg" )
  tableData.innerHTML = /* html */`
    <div>${ i }</div>
    <div>
      <span class="border inline-block border border-slate-300 rounded-full p-1 flex items-center justify-center updateDk w-5 h-5">
       
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-16 ease-in-out duration-300 transition-all text-rose-600 cross hidden">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>

      </span>
    </div>
    <input type="number" class="sCount rounded-lg bg-transparent updateSm border border-slate-300 text-base px-2" />
  `
  dayContent.appendChild( tableData )
}

const updateDk = document.querySelectorAll( ".updateDk" )

updateDk.forEach( drink =>
{
  drink.addEventListener( "click", () =>
  {
    let parent = drink.closest( ".tableRow" )
    let cross = parent.querySelector( ".cross" )
    cross.classList.toggle( "hidden" )
  } )
} )