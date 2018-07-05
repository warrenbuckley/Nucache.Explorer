using System;
using Microsoft.Owin.Hosting;

namespace Nucache.Explorer.Server
{
    class Program
    {
        static void Main(string[] args)
        {
            var baseAddress = "http://localhost:5698/";
            
            // Start OWIN host 
            using (WebApp.Start<Startup>(url: baseAddress))
            {
                Console.WriteLine("Press Enter to quit.");
                Console.ReadKey();
            }

        }
    }
}
