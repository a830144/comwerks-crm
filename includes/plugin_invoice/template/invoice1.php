<?php 
/** 
  * Copyright: dtbaker 2012
  * Licence: Please check CodeCanyon.net for licence details. 
  * More licence clarification available here:  http://codecanyon.net/wiki/support/legal-terms/licensing-terms/ 
  * Deploy: 11802 7369f9a61c2e79f820350e955c52cf4b
  * Envato: 31249ba5-dbc2-4eab-bc75-b0df6eb45c51
  * Package Date: 2016-12-01 15:01:26 
  * IP Address: 219.75.80.95
  */

$table_width = 1070;

?>


<html>
    <head>
        <title>PDF</title>
        <style type="text/css">
        body{
			font-family:arial;
			font-size:17px;
		}
        .table,
        .table2{
            border-collapse:collapse;
        }
        .table td,
        .table2 td.border{
            border:1px solid #EFEFEF;
            border-collapse:collapse;
            padding:4px;
        }
    </style>
    </head>
    <body>
    <table cellpadding="4" cellspacing="0" width="100%" align="center">
        <tbody>
            <tr>
                <td width="450" align="left" valign="top">
                    <p>
                        <font style="font-size: 1.6em;">
                            <strong>Invoice #:</strong> {INVOICE_NUMBER}<br/>
                        </font>
                        <strong>Due Date:</strong>
                        {DUE_DATE} <br/>
                    </p>
                    {INVOICE_PAID}
                </td>
                <td align="right" valign="top">
                    <p>
                        <font style="font-size: 1.6em;"><strong>{TITLE}</strong></font>
                        <br/>
                        <font style="color: #333333;">
                        [our company details]
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td align="left" valign="top">
                    <table width="100%" cellpadding="6" cellspacing="0" border="0">
                        <tbody>
                            <tr>
                                <td align="left" valign="top" width="110">
                                    <strong>INVOICE TO:</strong><br/>
                                    {CUSTOMER_DETAILS}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td align="right" valign="top">

                </td>
            </tr>
        </tbody>
    </table>
    {TASK_LIST}
</body>
</html>