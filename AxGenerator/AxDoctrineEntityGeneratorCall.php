<?php
/*
 * This file is part of the Axgen Bundle.
 *
 * (c) Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Acme\AxGenBundle\AxGenerator;

use Sensio\Bundle\GeneratorBundle\Generator\DoctrineEntityGenerator;
use Symfony\Component\HttpKernel\Util\Filesystem;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Sensio\Bundle\GeneratorBundle\Command\Validators;
use Symfony\Component\HttpFoundation\Request;
use Acme\AxGenBundle\AxGenerator\AxUtils;
/**
 * Generate a Entities 
 * 
 * @author: Alejandro Hurtado <ahurt2000@gmail.com> 
 */
class AxDoctrineEntityGeneratorCall 
{
    private $filesystem;
    private $registry;
    private $generator;

    public function __construct(Filesystem $filesystem, RegistryInterface $registry)
    {
        $this->filesystem = $filesystem;
        $this->registry = $registry;
        $this->generator = new DoctrineEntityGenerator($filesystem, $registry);
    }
    
    public function execute(Request $request, $kernel)
    {
        
        $bundle = $request->request->get('ne_bundle');
        $format = $request->request->get('ne_format');
        $repository = $request->request->get('ne_width_repo');
        $fields = $this->parseFields($request->request->get('ne_entities_data'));
        $entity = str_replace('/', '\\',$request->request->get('ne_name'));
        
        $bundle = $kernel->getBundle($bundle);
        $webRepository = ($repository == 'false')?false:true;
// die(var_dump($entity)); 
        $errors = array();
        $format = AxUtils::catchValidatorMsg('validateFormat', $format, $errors);
        
        //return any errors ->validation
        $chck = AxUtils::onError($errors);
        if($chck !==false){
            return $chck;
        }
        
        try{
         $this->generator->generate($bundle, $entity, $format, array_values($fields), $webRepository);
        }catch(\RuntimeException $e){
            $errors[]=$e->getMessage();
        }
        //return any errors in bundle generation
        $chck = AxUtils::onError($errors);
        if($chck !==false){
            return $chck;
        }else{
            $output[] = 'Generating the entity code: <b>OK</b>';
        } 
        
        return AxUtils::onSuccess($output);
    }
    
    private function parseFields($data)
    {
        $fields = array();
        foreach (json_decode($data) as $dat)
        {
            $name = $dat->fieldName;
            $type = $dat->type;
            $length = (strlen($dat->length) && !is_numeric($dat->length))?$dat->length:null;
            $fields[$name] = array('fieldName' => $name, 'type' => $type, 'length' => $length);
        }
   
        return $fields;
    }

    
}