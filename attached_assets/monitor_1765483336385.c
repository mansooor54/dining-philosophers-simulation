/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   monitor.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

int	is_dead(t_data *data)
{
	int	ret;

	pthread_mutex_lock(&data->dead_lock);
	ret = data->dead_flag;
	pthread_mutex_unlock(&data->dead_lock);
	return (ret);
}

static void	set_dead(t_data *data)
{
	pthread_mutex_lock(&data->dead_lock);
	data->dead_flag = 1;
	pthread_mutex_unlock(&data->dead_lock);
}

static int	check_philo_death(t_data *data)
{
	int			i;
	long long	time;

	i = 0;
	while (i < data->num_philos)
	{
		pthread_mutex_lock(&data->meal_lock);
		time = get_time() - data->philos[i].last_meal_time;
		if (time > data->time_to_die)
		{
			pthread_mutex_unlock(&data->meal_lock);
			set_dead(data);
			pthread_mutex_lock(&data->write_lock);
			printf("%s%lld %d died%s\n", RED, get_time() - data->start_time,
				data->philos[i].id, RESET);
			pthread_mutex_unlock(&data->write_lock);
			return (1);
		}
		pthread_mutex_unlock(&data->meal_lock);
		i++;
	}
	return (0);
}

static int	check_all_ate(t_data *data)
{
	int	i;
	int	finished;

	if (data->must_eat_count == -1)
		return (0);
	i = 0;
	finished = 0;
	while (i < data->num_philos)
	{
		pthread_mutex_lock(&data->meal_lock);
		if (data->philos[i].eat_count >= data->must_eat_count)
			finished++;
		pthread_mutex_unlock(&data->meal_lock);
		i++;
	}
	if (finished == data->num_philos)
	{
		set_dead(data);
		return (1);
	}
	return (0);
}

void	*monitor_routine(void *arg)
{
	t_data	*data;

	data = (t_data *)arg;
	wait_for_start(data);
	while (!is_dead(data))
	{
		if (check_philo_death(data) || check_all_ate(data))
			break ;
		usleep(500);
	}
	return (NULL);
}
