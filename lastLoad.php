<?php if($LastLoad): ?>
    <input type="hidden" name="load_id"   id="load_id" value="<?=$LastLoad->id?>"  />
    <input type="hidden" name="rand"   id="rand" value="<?=$rand?>"  />
<?php endif; ?>

<table class="table">
    <thead>
        <tr>
            <th>PREVIOUS LOAD</th>
            <th>DELIVERY</th>
            <th>OPEN</th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <?php if($LastLoad): ?>
                    <?=$LastLoad->load_number?>
                <?php endif; ?>
            </td>
            <td>
                <?php if($LoadStop): ?>
                    <?=$LoadStop->city . ", " . $LoadStop->state?>
                <?php endif; ?>
            </td>
            <td>
                <?php if($LastLoad): ?>
                    <button data-dojo-type="dijit/form/Button">OPEN
                        <script type="dojo/on" data-dojo-event="click">
                                 require([ "app/openDoc", "dojo/domReady!"],
                                     function(openDoc){
                                         var load_id = dojo.byId("load_id").value;
                                         var rand = dojo.byId("rand").value;
                                         var openDocFunc = new openDoc();
                                         openDocFunc.openById(load_id);

                                          var dialog = dijit.byId("dialogLastLoad"+rand);
                                          dialog.hide();

                                           dialog.hide();
                                            dojo.destroy("dialogLastLoad"+rand);
                                     });
                             </script>
                    </button>
                <?php endif; ?>
            </td>
        </tr>
    </tbody>
</table>