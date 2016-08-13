NEEDLE.transplant("XPath", function() {
// Extends its prototype with NEEDLE.Object's prototype
NEEDLE.extend(XPath, NEEDLE.Object);

/**
 * @class XPath
 *
 */
function XPath() {}

/**
 * @method selectSingleNode
 * @access public static
 *
 * @description Gets single node based on search criteria within a node.
 *
 * @param root XMLNode (required)
 * @param string String (required)
 *
 * @returns XMLNode
 */
XPath.selectSingleNode = function(root, string) {
	if (typeof XPathEvaluator != "undefined") {
		XPath.selectSingleNode = function(root, string) {
			var result = new XPathEvaluator().evaluate(string, root, {}, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			return (result != null) ? result.singleNodeValue : null;
		};
	} else if (typeof ActiveXObject != "undefined") {
		XPath.selectSingleNode = function(root, string) { return root.selectSingleNode(string); };
	}
	return XPath.selectSingleNode(root, string);
};

/**
 * @method selectNodes
 * @access public static
 *
 * @description Gets nodes collection based on search criteria within a node.
 *
 * @param root XMLNode (required)
 * @param string String (required)
 *
 * @returns Array
 */
XPath.selectNodes = function(root, string) {
	if (typeof XPathEvaluator != "undefined") {
		XPath.selectNodes = function(root, string) {
			var result = new XPathEvaluator().evaluate(string, root, {}, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), nodes = [];
			if (result != null) {
				var element = result.iterateNext();
				while (element) {
					nodes.push(element);
					element = result.iterateNext();
				}
			}
			return nodes;
		};
	} else if (typeof ActiveXObject != "undefined") {
		XPath.selectNodes = function(root, string) { return root.selectNodes(string); };
	}
	return XPath.selectNodes(root, string);
};

return XPath;
});
