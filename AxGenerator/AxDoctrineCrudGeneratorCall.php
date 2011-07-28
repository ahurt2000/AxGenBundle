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

use Symfony\Component\HttpKernel\Util\Filesystem;
use Sensio\Bundle\GeneratorBundle\Command\Validators;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\DoctrineBundle\Mapping\MetadataFactory;
use Sensio\Bundle\GeneratorBundle\Manipulator\RoutingManipulator;
use Sensio\Bundle\GeneratorBundle\Generator\DoctrineCrudGenerator;
use Sensio\Bundle\GeneratorBundle\Generator\DoctrineFormGenerator;
use Acme\AxGenBundle\AxGenerator\AxUtils;

class AxDoctrineCrudGeneratorCall {

    private $filesystem;
    private $generator;

    public function __construct(Filesystem $filesystem, $skeletonDir) {
        $this->filesystem = $filesystem;
        $this->generator = new DoctrineCrudGenerator($filesystem, $skeletonDir . '/crud');
        $this->formGenerator = new DoctrineFormGenerator($filesystem, $skeletonDir . '/form');
    }

    public function execute(Request $request, $kernel, $doctrine) {
        $bundle = $request->request->get('bundle-name');
        $entity = $request->request->get('entity');
        $format = $request->request->get('format');
        $withWrite = $request->request->get('with-write') == "false" ? false : true;
        $route_update = $request->request->get('route_update') == "false" ? false : true;
        $prefix = $request->request->get('route-prefix');

        $errors = array();
        $output = array();

        $bundle = AxUtils::catchValidatorMsg('validateBundleName', $bundle, $errors);
        $format = AxUtils::catchValidatorMsg('validateFormat', $format, $errors);

        $prefix = $this->getRoutePrefix($prefix, $entity);
        
        //return any errors ->validation
        $chck = AxUtils::onError($errors);
        if ($chck !== false) {
            return $chck;
        }

        $entityClass = $doctrine->getEntityNamespace($bundle) . '\\' . $entity;
        $bundle = $kernel->getBundle($bundle);
        $metadata = $this->getEntityMetadata($entityClass,$doctrine);

        /* generate */
        try {
            $this->generator->generate($bundle, $entity, $metadata[0], $format, $prefix, $withWrite);
        } catch (\RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        //return any errors in generation
        $chck = AxUtils::onError($errors);
        if ($chck !== false) {
            return $chck;
        } else {
            $output[] = 'Generating the CRUD code: <b>OK</b>';
        }
          
        // form
        if ($withWrite) {            
            try {
                $this->formGenerator->generate($bundle, $entity, $metadata[0]);
            } catch (\RuntimeException $e) {
                $errors[] = $e->getMessage();
            }
            //return any errors in generation
            $chck = AxUtils::onError($errors);        
            if ($chck !== false) {
                return $chck;
            } else {
                $output[] = 'Generating the Form code: <b>OK</b>';
            }               
        }

       // routing
        if ('annotation' != $format && $route_update) {
            $output[] = 'Importing the CRUD routes: ';
            $chck = $this->updateRouting($bundle, $format, $entity, $prefix);
            if( count($chck)>0 ){
                return  AxUtils::onError($chck);
            }else{
                $output[]='Importing routing resource: <b>OK</b>';
            }             
        }

        return AxUtils::onSuccess($output);
    }
    

    protected function getRoutePrefix($route_prefix, $entity) {
        $prefix = $route_prefix ? : strtolower(str_replace(array('\\', '/'), '_', $entity));

        if ($prefix && '/' === $prefix[0]) {
            $prefix = substr($prefix, 1);
        }

        return $prefix;
    }

    protected function getEntityMetadata($entity, $doctrine) {
        $factory = new MetadataFactory($doctrine);

        return $factory->getClassMetadata($entity)->getMetadata();
    }
    
    private function updateRouting( $bundle, $format, $entity, $prefix)
    {
        $this->filesystem->mkdir($bundle->getPath().'/Resources/config/');
        $routing = new RoutingManipulator($bundle->getPath().'/Resources/config/routing.yml');
        $ret =  $routing->addResource($bundle->getName(), $format, '/'.$prefix, 'routing/'.strtolower(str_replace('\\', '_', $entity))) ;
        if (!$ret) {
            $help = sprintf("        <b>resource: \"@%s/Resources/config/routing/%s.%s\"</b>\n", $bundle->getName(), strtolower(str_replace('\\', '_', $entity)), $format);
            $help .= sprintf("        <b>prefix:   /%s</b>\n", $prefix);

            return array(
                '- Import the bundle\'s routing resource in the bundle routing file',
                sprintf('  (%s).', $bundle->getPath().'/Resources/config/routing.yml'),
                '',
                sprintf('    <b>%s:</b>', $bundle->getName().('' !== $prefix ? '_'.str_replace('/', '_', $prefix) : '')),
                $help,
                '',
            );
        }
        return array();
    }    

}