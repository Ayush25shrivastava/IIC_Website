const SlidingBar = () => (
  <div className="bg-[#0E0E0E] py-1 overflow-hidden border-y border-[#B8A18A]/30 md:mt-0 mt-20">
    <div className="flex w-max animate-marquee">

      {[...Array(2)].map((_, idx) => (
        <div key={idx} className="flex">
          {[1,2,3,4].map(i => (
            <a
              key={i}
              href="/udbhav"
              className="mx-12 text-xs text-[#B8A18A] font-merriweather tracking-widest uppercase flex items-center gap-3 hover:text-[#fdfbf7] transition-colors"
            >
              <span className="animate-spin inline-block text-xs">◆</span>
              Participants of MNNIT <span className='text-[#fdfbf7] font-bold'> must register with their <span className="text-red-500">College Gsuite ID</span></span> 
              <span className="animate-spin inline-block text-xs">◆</span>
            </a>
          ))}
        </div>
      ))}

    </div>
  </div>
);

export default SlidingBar;