export function UnauthorizedPage(){

  return (

    <div className="
      min-h-screen
      grid
      place-items-center
      bg-slate-50
      p-6
    ">

      <div className="
        max-w-md
        rounded-2xl
        border
        bg-white
        p-8
        text-center
        shadow-sm
      ">

        <h1 className="
          text-2xl
          font-bold
          text-slate-900
        ">
          Access Restricted
        </h1>


        <p className="
          mt-3
          text-slate-500
        ">
          You do not have permission to access this page.
          Please contact your practice administrator if you think this is a mistake.
        </p>


        <a
          href="/dashboard"
          className="
            mt-6
            inline-flex
            rounded-xl
            bg-teal-600
            px-5
            py-3
            font-semibold
            text-white
            hover:bg-teal-700
          "
        >
          Return to Dashboard
        </a>


      </div>

    </div>

  );

}
