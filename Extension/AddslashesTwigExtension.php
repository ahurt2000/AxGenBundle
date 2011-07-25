<?php
// Acme/AxGenBundle/AddslashesExtension.php
namespace Acme\AxGenBundle\Extension;


class AddslashesTwigExtension extends \Twig_Extension {

    public function getFilters() {
        return array(
            'addslashes'   => new \Twig_Filter_Function('addslashes'),

        );
    }

    public function addslashes($value){
        return addslashes($value);
    }
    
    public function getName()
    {
        return 'addslashes_extension';
    }

}
