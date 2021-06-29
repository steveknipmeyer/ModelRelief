// -----------------------------------------------------------------------
// <copyright file="ExampleCard.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.Linq;

    /// <summary>
    /// Represents a card of an example model displayed on the landing page.
    /// </summary>
    public class ExampleCard
    {
        public string Title { get; set; }
        public string Name { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ExampleCard"/> class.
        /// Constructor.
        /// </summary>
        public ExampleCard()
        {
        }

        /// <summary>
        /// Gets the name of the preview image.
        /// </summary>
        public string PreviewImage
        {
            get
                {
                return $"{Name}.png";
                }
         }
    }
}