using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web.Http;
using CSharpTest.Net.Collections;
using CSharpTest.Net.Serialization;
using Nucache.Explorer.Server.Models;
using Nucache.Explorer.Server.Serializer;


namespace Nucache.Explorer.Server.Controllers
{
    public class NucacheController : ApiController
    {
        public ApiResponse GetNuCacheData(string filePath)
        {
            //Check for valid filepath
            if (File.Exists(filePath) == false)
            {
                //Throw error
            }

            //Check for file extension ends with .db
            //Don't want to attempt to any old file type
            if (Path.GetExtension(filePath) != ".db")
            {
                //Throw error
            }


            //We need to create a temp copy of the nucache DB - to avoid file locks if its in use whilst we try to read it
            //'NuCache.Content.db' will become 'NuCache.Content.Explorer.Temp.db'
            var tempFileName = filePath.Replace(".db", ".Explorer.Temp.db");
            File.Copy(filePath, tempFileName, true);

            var keySerializer = new PrimitiveSerializer();
            var valueSerializer = new ContentNodeKitSerializer();
            var options = new BPlusTree<int, ContentNodeKit>.OptionsV2(keySerializer, valueSerializer)
            {
                CreateFile = CreatePolicy.Never,
                FileName = tempFileName
            };

            //Read the file into a BPlusTreeObject & select the kits
            var tree = new BPlusTree<int, ContentNodeKit>(options);
            var sw = Stopwatch.StartNew();
            var kits = tree.Select(x => x.Value).ToArray();
            sw.Stop();
            tree.Dispose();

            //Delete the file (seems like could be a lock, so we wait 100ms between each attempt upto 10 times)
            var ok = false;
            var attempts = 0;
            while (!ok)
            {
                System.Threading.Thread.Sleep(100);
                try
                {
                    attempts++;
                    File.Delete(tempFileName);
                    ok = true;
                }
                catch
                {
                    if (attempts == 10)
                        throw;
                }
            }

            foreach (var kit in kits)
            {
                //Can I just reuse this object in JSON?!
                var foo = kit.ContentTypeId;

            }

            //Add to our JSON object the stopwatch clock to read the DB/dictionary file
            var response = new ApiResponse
            {
                Items = kits,
                TotalItems = kits.Length,
                StopClock = sw.ElapsedMilliseconds
            };
            
            return response;
        }
    }
}
