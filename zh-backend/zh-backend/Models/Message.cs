using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace zh_backend.Models
{
    public class Message
    {
        [Key]
        public string UID { get; set; }
        [StringLength(255)]
        public string Sender { get; set; }
        [StringLength(255)]
        public string Msg { get; set; }
        public DateTime Date { get; set; }
    }
}
